import { DefaultPropsType } from 'interfaces/types'
import { MouseEvent, useRef } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useCallback } from 'react'
import { CSSProperties, KeyboardEvent } from 'react'

import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'
import { UseFormRegisterReturn } from 'react-hook-form'

interface PropsType extends DefaultPropsType {
  className?: string
  inputStyle?: CSSProperties
  strValue?: any
  label: string
  name?: string
  register?: UseFormRegisterReturn
  disabled?: boolean
  onChange?: (data: any) => void
  listValue?: Answer[][]
}

export const InputQuestion = ({
  className = '',
  inputStyle,
  strValue = '',
  label,
  style,
  disabled,
  onChange,
  listValue,
}: PropsType) => {
  const [isExist, setIsExist] = useState(strValue ? true : false)
  const [selectedValue, setSelectedValue] = useState(null)
  const htmlFormat = useRef(strValue ?? '')

  const convertListInput = useCallback((strV: any, listV: Answer[][]) => {
    const list = []
    const matches = strV?.matchAll(/##/g)
    let index = 0
    for (const match of matches) {
      list.push({
        id: `${Math.random()}${index}`,
        value: listV[index],
      })
      index++
    }
    return list
  }, [])

  const listInput = useRef(convertListInput(strValue ?? '', listValue))

  const inputRef = useRef<HTMLDivElement>(null)
  const tableRef = useRef<HTMLDivElement>(null)
  const isInit = useRef(true)
  const groupKey = useRef(Math.random()).current

  useEffect(() => {
    if (selectedValue === null) return
    if (isInit.current) {
      isInit.current = false
    } else {
      if (typeof onChange === 'function') {
        onChange && onChange(formatValue(htmlFormat.current, listInput.current))
      }
    }
  }, [selectedValue])

  const formatValue = useCallback((html: any, inputs: any) => {
    return {
      question_text: html,
      answers: inputs
        .map((m: any) => m.value.map((g: any) => g.text).join('*'))
        .join('#'),
      correct_answers: inputs
        .map((m: any) => m.value.find((g: any) => g.isCorrect)?.text)
        .join('#'),
    }
  }, [])

  const onChangeText = (event: ContentEditableEvent) => {
    const listNode = Array.from(event.currentTarget.childNodes).filter(
      (m: any) => m.nodeName === 'INPUT',
    )
    if (listNode.length != listInput.current.length) {
      const listInputTemp: any[] = []
      listNode.forEach((el: any) => {
        listInputTemp.push(listInput.current.find((m) => m.id === el.id))
      })
      listInput.current = listInputTemp
    }
    const questionT = convertHtmlToStr(event.currentTarget.childNodes)
    htmlFormat.current = questionT
    setIsExist(questionT ? true : false)
    onChange && onChange(formatValue(htmlFormat.current, listInput.current))
  }

  const onKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    const isTab = event.code === 'Tab'
    const isEnter = event.code === 'Enter'
    let nodeEl: any = null
    if (isTab || isEnter) {
      event.preventDefault()
      const selection = window.getSelection()
      if (selection.rangeCount === 0) return
      const range = selection.getRangeAt(0)
      let newId = `${Math.random()}`
      const parentEl = range.startContainer
      if (parentEl.nodeName === 'INPUT') return
      if (isTab) {
        nodeEl = document.createElement('input')
        nodeEl.id = newId
        nodeEl.disabled = true
        range.insertNode(nodeEl)

        let inpIndex = -1
        for (const inp of Array.from(inputRef.current.childNodes)) {
          if (inp.nodeName === 'INPUT') inpIndex++
          if (inp === nodeEl) break
        }
        listInput.current.splice(inpIndex, 0, { id: newId, value: [] })
      } else {
        nodeEl = document.createElement('br')
        range.insertNode(nodeEl)
      }
      htmlFormat.current = convertHtmlToStr(
        Array.from(inputRef.current.childNodes),
      )
      setIsExist(htmlFormat.current ? true : false)

      onChange && onChange(formatValue(htmlFormat.current, listInput.current))

      setTimeout(() => {
        if (nodeEl) {
          if (nodeEl.nodeName === 'BR') {
            const range1 = document.createRange()
            range1.setStartBefore(nodeEl.nextSibling)
            selection.removeAllRanges()
            selection.addRange(range1)
          }
        }
      }, 0)
    }
  }, [])

  const onPaste = useCallback((event: any) => {
    event.preventDefault()
    const data = event.clipboardData.getData('text')
    const selection = window.getSelection()
    const range = selection.getRangeAt(0)
    range.deleteContents()
    const node = document.createTextNode(data)
    range.insertNode(node)
    selection.removeAllRanges()
    const newRange = document.createRange()
    newRange.setStart(node, data.length)
    selection.addRange(newRange)
  }, [])

  // const onClickStyle = useCallback((style: string) => {
  //   const selection = window.getSelection()
  //   const range = selection.getRangeAt(0)

  //   if (IsAncestorTag(range.commonAncestorContainer, style.toUpperCase())) {
  //     return
  //   }

  //   const frag = range.cloneContents()
  //   range.deleteContents()
  //   const node = document.createElement(style)
  //   removeSameNodeType(node, Array.from(frag.childNodes), style.toUpperCase())
  //   range.insertNode(node)
  //   selection.removeRange(range)
  //   htmlFormat.current = convertHtmlToStr(
  //     Array.from(inputRef.current.childNodes),
  //   )
  //   onChange && onChange(htmlFormat.current)
  // }, [])

  const convertStrToHtml = useCallback((dataD: any) => {
    const matches = dataD?.matchAll(/(#[^#]*#|%lb%|%u%|%b%|%i%)/g)
    let result = dataD
    let index = 0
    const styleIndex: any = {}
    for (const match of matches) {
      if (match[0].startsWith('#')) {
        const item = listInput.current[index]
        result = result.replace(match[0], `<input id='${item.id}' disabled/>`)
        index++
      } else if (match[0] === '%lb%') {
        result = result.replace(match[0], '<br/>')
      } else {
        const sIndex = styleIndex[match[0]] ?? 0
        const tag = match[0].replaceAll('%', '')
        result = result.replace(
          match[0],
          sIndex % 2 === 0 ? `<${tag}>` : `</${tag}>`,
        )
        styleIndex[match[0]] = sIndex + 1
      }
    }
    return result + '<br/>'
  }, [])

  const convertHtmlToStr = useCallback((dataD: ChildNode[]) => {
    let str = ''
    for (let i = 0, len = dataD.length; i < len; i++) {
      const child = dataD[i] as Node
      if (child.nodeName === '#text') {
        str += child.textContent
      } else if (child.nodeName === 'SPAN') {
        str += child.firstChild.textContent
      } else if (child.nodeName === 'BR') {
        str += '%lb%'
      } else if (child.nodeName === 'INPUT') {
        str += `##`
      } else {
        const el = child as Element
        const tag = child.nodeName.toLowerCase()
        const content = convertHtmlToStr(Array.from(el.childNodes))
        if (content !== '') {
          str += `%${tag}%${content}%${tag}%`
        }
      }
    }
    if (str.endsWith('%lb%')) str = str.substring(0, str.length - 4)
    return str
  }, [])

  const onClickInput = (e: MouseEvent<HTMLDivElement>) => {
    const input = e.target as HTMLInputElement
    if (input.tagName === 'INPUT') {
      setSelectedValue(listInput.current.find((m) => m.id === input.id))

      const inputRect = input.getBoundingClientRect()
      const parentRect = inputRef.current.getBoundingClientRect()
      const offetTop = inputRect.top - parentRect.top + inputRect.height + 10
      const offsetLeft =
        inputRect.left - parentRect.left + inputRect.width / 2 - 5

      tableRef.current.style.top = `${offetTop}px`
      tableRef.current.style.display = 'unset'
      tableRef.current.style.setProperty('--offset-left', `${offsetLeft}px`)
    }
  }

  const onClosePopup = () => {
    setSelectedValue(null)
    tableRef.current.style.display = null
  }

  const onChangeIsCorrect = (answerIndex: number) => {
    selectedValue.value.forEach((m: any, mIndex: number) => {
      m.isCorrect = mIndex === answerIndex
    })
    const item = listInput.current.find((m) => m.id === selectedValue.id)
    item.value = selectedValue.value
    setSelectedValue({ ...selectedValue })
  }

  const onChangeAnswerText = (answerIndex: number, e: any) => {
    selectedValue.value[answerIndex].text = e.target.value
    const item = listInput.current.find((m) => m.id === selectedValue.id)
    item.value[answerIndex].text = e.target.value
    setSelectedValue({ ...selectedValue })
  }

  const onAddAnswer = () => {
    selectedValue.value.push({ text: '', isCorrect: false })
    const item = listInput.current.find((m) => m.id === selectedValue.id)
    item.value = selectedValue.value
    setSelectedValue({ ...selectedValue })
  }

  const onDeleteAnswerText = (answerIndex: number) => {
    selectedValue.value.splice(answerIndex, 1)
    const item = listInput.current.find((m) => m.id === selectedValue.id)
    item.value = selectedValue.value
    setSelectedValue({ ...selectedValue })
  }

  return (
    <div
      className={`a-content-with-label ${className}`}
      data-exist={isExist}
      style={style}
    >
      <ContentEditable
        innerRef={inputRef}
        spellCheck={false}
        style={inputStyle}
        disabled={disabled}
        html={convertStrToHtml(htmlFormat.current)}
        contentEditable="true"
        onChange={onChangeText}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
        onClick={onClickInput}
      />
      <label>
        <span>{label}</span>
      </label>

      <div ref={tableRef} className="popup-table">
        {selectedValue && (
          <table className={`question-table`}>
            <thead>
              <tr>
                <th>Đáp án đúng</th>
                <th align="left">Danh sách đáp án</th>
                <th className="action">
                  <img
                    src="/images/icons/ic-close-dark.png"
                    width={20}
                    height={20}
                    onClick={onClosePopup}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedValue?.value?.map(
                (answer: Answer, answerIndex: number) => [
                  <tr key={`${groupKey}_${answerIndex}`}>
                    <td align="center">
                      <input
                        type="radio"
                        name={groupKey.toString()}
                        checked={answer.isCorrect}
                        onChange={onChangeIsCorrect.bind(null, answerIndex)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={answer.text}
                        onChange={onChangeAnswerText.bind(null, answerIndex)}
                      />
                    </td>
                    <td align="right">
                      <img
                        onClick={onDeleteAnswerText.bind(null, answerIndex)}
                        className="ic-action"
                        src="/images/icons/ic-trash.png"
                      />
                    </td>
                  </tr>,
                  <tr key={`divide_${answerIndex}`} className="divide">
                    <td colSpan={3} align="center">
                      <div></div>
                    </td>
                  </tr>,
                ],
              )}
              <tr className="action">
                <td></td>
                <td colSpan={2} align="left">
                  <label className="add-new-answer" onClick={onAddAnswer}>
                    <img
                      src="/images/icons/ic-plus-sub.png"
                      width={17}
                      height={17}
                    />{' '}
                    Thêm đáp án
                  </label>
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

type Answer = {
  text: string
  isCorrect: boolean
}
