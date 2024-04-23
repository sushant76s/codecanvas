// const { PrismaClient } = require("@prisma/client");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createUser(username, language, stdin, sourceCode, stdout) {
  return await prisma.codeSnippet.create({
    data: {
      username,
      language,
      stdin,
      sourceCode,
      stdout,
    },
  });
}

// Example usage:
async function main() {
  const newUser = await createUser(
    "John Doe",
    "c++",
    "Hi",
    "print('Hi')",
    "Hi"
  );
  console.log("Created user:", newUser);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
