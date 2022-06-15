import { useRef, forwardRef, useImperativeHandle, MouseEvent } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useCallback } from 'react'
import { CSSProperties, KeyboardEvent } from 'react'

import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'
import { UseFormRegisterReturn } from 'react-hook-form'

import { DefaultPropsType } from '../../../interfaces/types'

interface PropsType extends DefaultPropsType {
  className?: string
  inputStyle?: CSSProperties
  strValue?: any
  label: string
  name?: string
  reverse?: boolean
  register?: UseFormRegisterReturn
  disabled?: boolean
  autoFocus?: boolean
  isMultiTab?: boolean
  disableTab?: boolean
  disableTabInput?: boolean
  styleAction?: ('u' | 'i' | 'b')[]
  onChange?: (data: string) => void
  onTabClick?: (e: MouseEvent<HTMLDivElement>, index: number) => void
  onTabCreated?: (id: string, index: number) => void
  onTabsDeleted?: (indexes: number[]) => void
}

export const ContentField = forwardRef(
  (
    {
      className = '',
      inputStyle,
      strValue = '',
      label,
      style,
      disabled,
      isMultiTab = false,
      disableTab = false,
      disableTabInput = false,
      styleAction = [],
      onChange,
      onTabClick,
      onTabCreated,
      onTabsDeleted,
    }: PropsType,
    ref,
  ) => {
    useImperativeHandle(ref, () => ({
      pressTab: handleTab,
      getBoundingClientRect: () => {
        return inputRef.current.getBoundingClientRect()
      },
    }))

    const inputMinWidth = 70
    const [isExist, setIsExist] = useState(strValue ? true : false)
    const htmlFormat = useRef(strValue ?? '')

    const inputRef = useRef<HTMLDivElement>(null)
    const hiddenRef = useRef<HTMLSpanElement>(null)

    useEffect(() => {
      inputRef.current.addEventListener('input', onInputChange)
      inputRef.current.addEventListener('keydown', onPreventTabKey)
      setTimeout(() => {
        for (let i = 0, len = listInput.current.length; i < len; i++) {
          const childN = document.getElementById(
            `${listInput.current[i].id}`,
          ) as HTMLInputElement
          if (childN.nodeName === 'INPUT') {
            hiddenRef.current.textContent = childN.value
            if (hiddenRef.current.offsetWidth > inputMinWidth) {
              childN.style.width = `${hiddenRef.current.offsetWidth}px`
              listInput.current[i].width = hiddenRef.current.offsetWidth
            } else {
              childN.style.width = `${inputMinWidth}px`
              listInput.current[i].width = inputMinWidth
            }
          }
        }
      }, 0)

      return () => {
        inputRef?.current?.removeEventListener('input', onInputChange)
        inputRef?.current?.removeEventListener('keydown', onPreventTabKey)
      }
    }, [])

    const convertListInput = useCallback((strV: any) => {
      const list = []
      const matches = strV?.matchAll(/#[^#]*#/g)
      let index = 0
      for (const match of matches) {
        list.push({
          id: `${Math.random()}${index}`,
          value: match[0].replaceAll('#', ''),
          width: inputMinWidth,
        })
        index++
      }
      return list
    }, [])

    const listInput = useRef(convertListInput(strValue ?? ''))

    const onInputChange = useCallback((e: Event) => {
      const el = e.target as HTMLInputElement
      if (el.nodeName !== 'INPUT') return
      const itemInput = listInput.current.find((m) => m.id === el.id)
      itemInput.value = el.value
      htmlFormat.current = convertHtmlToStr(
        Array.from(inputRef.current.childNodes),
      )
      onChange && onChange(htmlFormat.current)
      setTimeout(() => {
        hiddenRef.current.textContent = el.value
        if (hiddenRef.current.offsetWidth > 70) {
          el.style.width = `${hiddenRef.current.offsetWidth}px`
          itemInput.width = hiddenRef.current.offsetWidth
        } else {
          el.style.width = `${inputMinWidth}px`
          itemInput.width = inputMinWidth
        }
      }, 0)
    }, [])

    const onPreventTabKey = useCallback((e: any) => {
      const el = e.target as HTMLInputElement
      if (el.nodeName === 'INPUT' && (e.code === 'Tab' || e.code === 'Enter')) {
        e.preventDefault()
        e.stopPropagation()
      }
    }, [])

    const onChangeText = (event: ContentEditableEvent) => {
      const listNode = Array.from(event.currentTarget.childNodes).filter(
        (m: any) => m.nodeName === 'INPUT',
      )
      if (listNode.length != listInput.current.length) {
        const listInputTemp: any[] = []
        const listRemaim: any[] = [...listInput.current]
        listNode.forEach((el: any) => {
          const index = listRemaim.findIndex((m) => m.id === el.id)
          listInputTemp.push(listRemaim.splice(index, 1)[0])
        })
        onTabsDeleted &&
          onTabsDeleted(
            listRemaim.map((m) =>
              listInput.current.findIndex((g) => g.id === m.id),
            ),
          )
        listInput.current = listInputTemp
      }
      const questionT = convertHtmlToStr(event.currentTarget.childNodes)
      htmlFormat.current = questionT
      setIsExist(questionT ? true : false)
      onChange && onChange(htmlFormat.current)
    }

    const handleTab = useCallback(() => {
      let nodeEl: any = null
      const selection = window.getSelection()
      if (selection.rangeCount === 0) return
      const range = selection.getRangeAt(0)
      if (
        !isElement(range.commonAncestorContainer as Element, inputRef.current)
      ) {
        return
      }
      let newId = `${Math.random()}${listInput.current.length}`
      const parentEl = range.startContainer
      if (parentEl.nodeName === 'INPUT') return
      if (!isMultiTab && listInput.current.length > 0) return
      nodeEl = document.createElement('input')
      nodeEl.id = newId
      nodeEl.autocomplete = 'off'
      nodeEl.style.width = `${inputMinWidth}px`
      nodeEl.disabled = disableTabInput
      range.insertNode(nodeEl)

      let inpIndex = -1
      for (const inp of Array.from(inputRef.current.childNodes)) {
        if (inp.nodeName === 'INPUT') inpIndex++
        if (inp === nodeEl) break
      }
      listInput.current.splice(inpIndex, 0, {
        id: newId,
        value: '',
        width: inputMinWidth,
      })
      htmlFormat.current = convertHtmlToStr(
        Array.from(inputRef.current.childNodes),
      )
      setIsExist(htmlFormat.current ? true : false)

      onTabCreated && onTabCreated(newId, inpIndex)
      onChange && onChange(htmlFormat.current)

      setTimeout(() => {
        if (nodeEl) {
          if (nodeEl.nodeName === 'INPUT') {
            if (!disableTabInput) {
              nodeEl.focus()
            } else {
              if (nodeEl.nextSibling) {
                const range1 = document.createRange()
                range1.setStartBefore(nodeEl.nextSibling)
                selection.removeAllRanges()
                selection.addRange(range1)
              }
            }
          }
        }
      }, 0)
    }, [])

    const handleEnter = useCallback(() => {
      let nodeEl: any = null
      const selection = window.getSelection()
      if (selection.rangeCount === 0) return
      const range = selection.getRangeAt(0)
      nodeEl = document.createElement('br')
      range.insertNode(nodeEl)

      htmlFormat.current = convertHtmlToStr(
        Array.from(inputRef.current.childNodes),
      )
      setIsExist(htmlFormat.current ? true : false)

      onChange && onChange(htmlFormat.current)

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
    }, [])

    const onKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
      const isTab = !disableTab && event.code === 'Tab'
      const isEnter = event.code === 'Enter'
      if (isTab || isEnter) {
        event.preventDefault()
        if (isTab) handleTab()
        else if (isEnter) handleEnter()
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

    const onClickStyle = useCallback((style: string) => {
      const selection = window.getSelection()
      const range = selection.getRangeAt(0)

      if (IsAncestorTag(range.commonAncestorContainer, style.toUpperCase())) {
        return
      }

      const frag = range.cloneContents()
      range.deleteContents()
      const node = document.createElement(style)
      removeSameNodeType(node, Array.from(frag.childNodes), style.toUpperCase())
      range.insertNode(node)
      selection.removeRange(range)
      htmlFormat.current = convertHtmlToStr(
        Array.from(inputRef.current.childNodes),
      )
      onChange && onChange(htmlFormat.current)
    }, [])

    const convertStrToHtml = useCallback((dataD: any) => {
      const matches = dataD?.matchAll(/(#[^#]*#|%lb%|%u%|%b%|%i%)/g)
      let result = dataD
      let index = 0
      const styleIndex: any = {}
      for (const match of matches) {
        if (match[0].startsWith('#')) {
          const itemInput = listInput.current[index]
          result = result.replace(
            match[0],
            `<input id="${
              itemInput.id
            }" autocomplete="off" value="${match[0].replaceAll(
              '#',
              '',
            )}" style="width:${
              itemInput.width === 0 ? inputMinWidth : itemInput.width
            }px" ${disableTabInput ? 'disabled' : ''}/>`,
          )
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
          const inputEl = child as HTMLInputElement
          str += `#${inputEl.value}#`
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
        e.preventDefault()
        onTabClick &&
          onTabClick(
            e,
            listInput.current.findIndex((m) => m.id === input.id),
          )
      }
    }

    return (
      <div
        className={`a-content-with-label ${className}`}
        data-exist={isExist}
        data-style={styleAction.length > 0}
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
        <div className="style-action">
          {styleAction.map((m) => (
            <div
              key={m}
              className={`style-${m}`}
              onClick={onClickStyle.bind(null, m)}
            />
          ))}
        </div>
        <span className="hidden-text" ref={hiddenRef}></span>
      </div>
    )
  },
)

const removeSameNodeType = (
  parent: HTMLElement,
  nodes: ChildNode[],
  style: string,
) => {
  for (const node of nodes) {
    if (node.nodeName === style) {
      removeSameNodeType(parent, Array.from(node.childNodes), style)
    } else {
      parent.appendChild(node)
    }
  }
}

const IsAncestorTag = (node: Node, style: string): boolean => {
  if (node.nodeName === style) {
    return true
  }
  if (node.parentNode) {
    return IsAncestorTag(node.parentNode, style)
  }
  return false
}

const isElement = (el: Element, target: Element): boolean => {
  if (el === target) return true
  if (el.parentElement) return isElement(el.parentElement, target)
  return false
}
