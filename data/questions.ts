const list = [
  {
    id: '1',
    series: 'dsadsa',
    grade: '1',
    types: '23',
    skills: 'reading',
    questionType: 'MG',
    level: '2',
    questionDescription: 'dsadsa',
    questionText: 'dsadsa',
    answers: '1',
    correctAnswers: '23',
    publisher: 'DTP',
  },
  {
    id: '2',
    series: '123',
    grade: '12',
    types: '23',
    skills: 'writing',
    questionType: 'MG',
    level: '2',
    questionDescription: 'dsadsa',
    questionText: 'd223sadsa',
    answers: '1',
    correctAnswers: '23',
    publisher: 'DTP',
  },
]
const getList = () => {
  return list
}

const addItem = (item: any) => {
  const id = parseInt(list[list.length - 1]?.id ?? '0') + 1
  list.push({ ...item, id: id.toString() })
  return id
}

const updateItem = (item: any) => {
  const index = list.findIndex((m) => m.id === item.id)
  list[index] = { ...item }
}

const removeItem = (id: string) => {
  const index = list.findIndex((m) => m.id === id)
  list.splice(index, 1)
}

const getItem = (id: string) => {
  return list.find((m) => m.id === id)
}

export { getList, getItem, addItem, removeItem, updateItem }
