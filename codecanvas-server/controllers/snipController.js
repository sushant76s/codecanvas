const Redis = require("ioredis");
const { Queue } = require("bullmq");
const prisma = require("../config/prismadb");

const client = new Redis({
  host: "localhost",
  port: 6379,
  maxRetriesPerRequest: null,
});

const snipQueue = new Queue("snipQueue", {
  connection: client,
});

exports.addCodeSnip = async (req, res) => {
  const { username, language, input, code } = req.body;

  if (!username || !language || !input || !code) {
    return res.json({ message: "Please provide all details" });
  }

  try {
    const snipCode = await prisma.snips.create({
      data: {
        username: username,
        language: language,
        stdin: input || "",
        sourceCode: code,
      },
    });

    await snipQueue.add(`snip:${snipCode.id}`, snipCode);

    await client.set(
      `snip:${snipCode.id}`,
      JSON.stringify(snipCode),
      "EX",
      200
    );
    res.json({ message: "Success" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
  //   console.log("username: ", username);
  //   console.log("language: ", language);
  //   console.log("input: ", input);
  //   console.log("code: ", code);
};

exports.getCodeSnips = async (req, res) => {
  try {
    let data = [];
    const keys = await client.keys("snip:*");
    if (keys.length > 1) {
      const redisValues = await client.mget(keys);
      return res.json({ redis: redisValues });
    } else {
      data = await prisma.snips.findMany({
        orderBy: {
          id: "desc",
        },
      });
      for (const item of data) {
        await client.set(`snip:${item.id}`, JSON.stringify(item), "EX", 200);
      }

      return res.json({ db: data });
    }
  } catch (error) {
    console.error("Error fetching snips: ", error);
    return res.status(500).json({ message: "Failed to fetch snips" });
  }
};
