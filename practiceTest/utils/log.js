export const logInfoApp = () => {
  console.log(
    '%cā WELCOME TO PRACTICE TESTS',
    `
        padding: 16px;
        color: #2692ff;
        font-size: 32px;
        font-weight: bolder;
        text-shadow: 0 0 8px #fff;
      `,
  )
  console.log(
    '%cš LOAD LEAD SCRIPT š¤',
    `
        padding: 12px;
        color: #00edff;
        font-size: 24px;
        font-weight: bold;
        text-shadow: 0 0 4px #fff;
      `,
  )
  console.log(`š  The Starry Night ā” %cDTP Education`, 'color: #32d340;')
  console.log(
    `šÆ LEAD Version: %c${process.env.NEXT_PUBLIC_VERSION}`,
    'color: #32d340;',
  )
}

export const consoleLog = (action = 'action', text = '') => {
  console.log(`${action} š %c${text}`, 'color: #2692ff')
}
