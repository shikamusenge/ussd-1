const User = require("../utilities/User");
const format = require("../utilities/responseFormarter");

const userService = async (req, res) => {
  const { sessionId, serviceCode, phoneNumber, text } = req.body;
  const Person = new User(phoneNumber);

  let response = "";
  // Start of USSD session
  if (text === "" || text.endsWith("*0")) {
    response = format({
      title: "Welcome to it Level 7",
      body: "Airtime and bundle purchase",
      list: ["Kinyarwanda", "English"],
      type: "CON",
    });
  } else if (text === "1") {
    response = format({
      title: "HITAMO",
      list: ["Hitamo nimero", "Andika nimero"],
      type: "CON",
    });
  } else if (text === "2") {
    response = format({
      title: "CHOOSE",
      list: ["Choose Number", "Enter Number"],
      type: "CON",
    });
  }

  // Phone number selection in Kinyarwanda
  if (text === "1*1") {
    response = format({
      title: "Hitamo nimero",
      list: [phoneNumber.slice(3)],
      type: "CON",
    });
  } else if (text === "1*2") {
    response = format({
      title: "Andika nimero 078XXXXXXX",
      type: "CON",
    });
  }

  // Phone number selection in English
  if (text === "2*1") {
    response = format({
      title: "Choose Number",
      list: [phoneNumber.slice(2)],
      type: "CON",
    });
  } else if (text === "2*2") {
    response = format({
      title: "Enter Number 078XXXXXXX",
      type: "CON",
    });
  }

  // Bundle selection in Kinyarwanda
  if (text == "1*1*1") {
    response = format({
      title: `Hitamo bandle kuri ${phoneNumber.slice(3)}`,
      list: [
        "UKWEZI 3G (3000 FRW)",
        "ICYUMWERU 3G (700 FRW)",
        "UMUNSI 1G (300 FRW)",
      ],
      type: "CON",
      footer: "9. next",
    });
  } else if (text.startsWith("1*2*")) {
    const customNumber = text.split("*").pop();
    if (/[078][0-9]{10}/.test(customNumber)) {
      response = "END Nimero mwinjije nimero idahura 078XXXXXXX";
      console.log("fail", { customNumber });
    } else {
      response = format({
        title: `Hitamo bandle wo kuri ${customNumber}`,
        list: [
          "UKWEZI 3G (3000 FRW)",
          "ICYUMWERU 3G (700 FRW)",
          "UMUNSI 1G (300 FRW)",
        ],
        type: "CON",
        footer: "9. back",
      });
    }
  }

  // Bundle selection in English
  if (text == "2*1*1") {
    response = format({
      title: `Choose bundle for ${phoneNumber.slice(3)}`,
      list: [
        "Monthly 3G (3000 FRW)",
        "Weekly 3G (700 FRW)",
        "Daily 1G (300 FRW)",
      ],
      type: "CON",
      footer: "9. next",
    });
  } else if (text.startsWith("2*2*")) {
    const customNumber = text.split("*").pop();
    if (/[078][0-9]{10}/.test(customNumber)) {
      response = "END Enter valid Number 078XXXXXXX";
    } else {
      response = format({
        title: `Choose bundle for ${customNumber}`,
        list: [
          "Monthly 3G (3000 FRW)",
          "Weekly 3G (700 FRW)",
          "Daily 1G (300 FRW)",
        ],
        type: "CON",
        footer: "9. next",
      });
    }
  }

  if (
    text.startsWith("1*1*1*1") ||
    text.startsWith("1*1*1*2") ||
    text.startsWith("1*1*1*3") ||
    text.startsWith("1*1*1*4") ||
    text.startsWith("1*1*1*5") ||
    text.startsWith("1*1*1*6") ||
    (text.startsWith("1*2*") && text.endsWith("*1")) ||
    (text.startsWith("1*2*") && text.endsWith("*2")) ||
    (text.startsWith("1*2*") && text.endsWith("*3")) ||
    text.endsWith("*9*4") ||
    text.endsWith("*9*5") ||
    text.endsWith("*9*6")
  ) {
    const lastChoice = text.split("*").pop(); // Determine which bundle was chosen
    const amountPaid =
      lastChoice === "1"
        ? "3000"
        : lastChoice === "2"
        ? "700"
        : lastChoice === "3"
        ? "300"
        : lastChoice === "4"
        ? "5000"
        : lastChoice === "5"
        ? "7000"
        : "15000";
    const data = {
      phone: phoneNumber.slice(3),
      amount: Number(amountPaid),
      bandle: `4G ${amountPaid} FRW`,
    };
    const transaction = await Person.buy(data);
    console.log(transaction);
    if (transaction) {
      response = format({
        body: `Kugura bundle byagenze neza. Amafaranga yishyuwe: ${amountPaid} FRW.`,
        type: "END",
      });
    } else {
      response = `END Insaficient fund to buy this bandle`;
    }
  }

  // Successful purchase in English with amount
  if (
    text.startsWith("2*1*1*1") ||
    text.startsWith("2*1*1*2") ||
    text.startsWith("2*1*1*3") ||
    (text.startsWith("2*2*") && text.endsWith("*1")) ||
    (text.startsWith("2*2*") && text.endsWith("*2")) ||
    (text.startsWith("2*2*") && text.endsWith("*3")) ||
    text.endsWith("*9*4") ||
    text.endsWith("*9*5") ||
    text.endsWith("*9*6")
  ) {
    const lastChoice = text.split("*").pop(); // Determine which bundle was chosen
    const amountPaid =
      lastChoice === "1"
        ? "3000 FRW"
        : lastChoice === "2"
        ? "700 FRW"
        : "300 FRW";
    response = format({
      body: `Bundle purchase was successful. Amount paid: ${amountPaid}.`,
      type: "END",
    });
  }

  if (text.endsWith("*9") && text.startsWith("2")) {
    response = format({
      title: `Choose bundle`,
      body: `4. Monthly 5G (5000 FRW)
         5. Monthly 2G Day (7000 FRW)
        6. Monthly 10G (15,000 FRW)`,

      type: "CON",
    });
  }
  if (text.endsWith("*9") && text.startsWith("1")) {
    response = format({
      title: `Choose bundle`,
      body: `
      4. Ukwezi 5G (5000 FRW)
      5. Ukwezi 2G Day (7000 FRW),
      6. Ukwezi 10G (15,000 FRW),
      `,
      type: "CON",
    });
  }

  res.set("Content-Type: text/plain");
  res.send(response);
};

module.exports = userService;
