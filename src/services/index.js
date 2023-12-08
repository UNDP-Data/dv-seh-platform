function timeout(ms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

async function askQuestion() {
  await timeout(5000);
  return 'What is the sum of budgets for active energy-related project for the Latin America and Caribbean region?';
}

export default {
  askQuestion,
};
