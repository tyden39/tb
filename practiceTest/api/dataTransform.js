import { hashId } from '../utils/router'

export const heroDataTransform = (data) => {
  if (!data || !data[0]) return null
  return {
    description: data[0]?.description ? data[0].description : '',
    title: data[0]?.name ? data[0].name : '',
  }
}

export const gradeDataTransform = (data) => {
  if (!data) return null
  return {
    id: data?.id ? data.id : Math.random(),
    isDisabled: data?.isDisabled ? data.isDisabled : false,
    name: data?.name ? data.name : '',
    slug: 'grade-' + hashId(data?.id, 'grade'),
  }
}

export const testDataTransform = (data) => {
  if (!data) return null
  return {
    id: data?.id ? data.id : Math.random(),
    isFree: data?.isFree === true ? true : false,
    name: data?.name ? data.name : '',
    slug: 'test-' + hashId(data?.id, 'test'),
  }
}

export const partDataTransform = (data) => {
  if (!data) return null
  return {
    id: data?.id ? data.id : Math.random(),
    name: data?.name ? data.name : '',
    point: data?.totalPoint ? data.totalPoint : 0,
  }
}

export const questionListTransform = (arr, index) => {
  let returnArr = []
  let count = 0
  if (arr && arr[index]?.list);
  // console.log("parent=====", arr[index]);

  
  const countQuestion = countQuestionPart(arr[index].list);
  arr[index].list.forEach((parent) => {
    if (parent?.list)
      parent.list.forEach((list) => {
        // single question

        // console.log('list.listContent.length=====', list.listContent)

        if (list.totalQuestion === list.listContent.length) {
          // console.log('1111111====');
          list.listContent.forEach((item) => {
            item.activityType = list.activityType
            item.audioInstruction = list.audioInstruction
            item.audioScript = list.audioScript
            item.imageInstruction = list.imageInstruction
            item.index = count
            item.instruction = list.instruction
            item.group = 1
            // item.point = parent.totalPoint / arr[index].list.length
            item.point = parent.totalPoint / countQuestion
            item.questionInstruction = list.questionInstruction
            item.skill = list.skill
            returnArr.push(item)
            count++
          })
        }
        // group question
        else {
          // console.log('2222222222=======', arr[index], list)
          Array.from(Array(list.totalQuestion), () => {
            // console.log('list.listContent[0]==', list.listContent)
            let cloneItem = list.listContent[0]
            cloneItem.id = list.id;
            if (
              cloneItem?.questionsGroup &&
              cloneItem.questionsGroup.length > 0
            ) {
              cloneItem.questionsGroup.forEach((item, i) => {
                cloneItem.activityType = item.activityType
                cloneItem.audioInstruction = list.audioInstruction
                cloneItem.audioScript = list.audioScript
                cloneItem.imageInstruction = list.imageInstruction
                cloneItem.index = count
                cloneItem.instruction = list.instruction
                cloneItem.group = list.totalQuestion
                // cloneItem.point = parent.totalPoint / arr[index].list.length
                cloneItem.point = parent.totalPoint / countQuestion
                cloneItem.questionInstruction = list.questionInstruction
                cloneItem.skill = list.skill
                if (i === 0) return
              })
              returnArr.push(cloneItem)
              count++
            } else {
              // console.log('FUFUFUFUUF=====', list)
              //group question from many items
              cloneItem.audioInstruction = list.audioInstruction
              cloneItem.audioScript = list.audioScript
              cloneItem.imageInstruction = list.imageInstruction
              cloneItem.index = count
              cloneItem.instruction = list.instruction
              cloneItem.group = list.totalQuestion
              // cloneItem.point = parent.totalPoint / arr[index].list.length
              cloneItem.point = parent.totalPoint / countQuestion
              cloneItem.questionInstruction = list.questionInstruction
              cloneItem.skill = list.skill
              returnArr.push(cloneItem)
              count++
            }
          })
        }
      })
  })

  return returnArr
}

function countQuestionPart(data) {
  let countQuestionPart = 0;

  data.forEach((parent) => {
    if (parent?.list) {
      parent.list.forEach((list) => {
        countQuestionPart += list.totalQuestion;
      })
    }
  })

  return countQuestionPart
}
