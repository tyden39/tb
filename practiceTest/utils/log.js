export const logInfoApp = () => {
  console.log(
    '%c✌ WELCOME TO PRACTICE TESTS',
    `
        padding: 16px;
        color: #2692ff;
        font-size: 32px;
        font-weight: bolder;
        text-shadow: 0 0 8px #fff;
      `,
  )
  console.log(
    '%c🚀 LOAD LEAD SCRIPT 🤟',
    `
        padding: 12px;
        color: #00edff;
        font-size: 24px;
        font-weight: bold;
        text-shadow: 0 0 4px #fff;
      `,
  )
  console.log(`🌠 The Starry Night ➡ %cDTP Education`, 'color: #32d340;')
  console.log(
    `🎯 LEAD Version: %c${process.env.NEXT_PUBLIC_VERSION}`,
    'color: #32d340;',
  )
}

export const consoleLog = (action = 'action', text = '') => {
  console.log(`${action} 👉 %c${text}`, 'color: #2692ff')
}
