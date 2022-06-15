import { useContext } from 'react'

import { Button } from 'rsuite'

import { templateDetailTransform } from 'api/dataTransform'
import { SingleTemplateContext, WrapperContext } from 'interfaces/contexts'

export const FooterUnittest = ({
  className = '',
  slider,
  style,
  setSlider,
}: any) => {
  const { chosenTemplate } = useContext(SingleTemplateContext)
  const { globalModal } = useContext(WrapperContext)

  const handleSubmit = async () => {
    switch (slider) {
      case 0:
        if (chosenTemplate.state?.id)
          await fetch('/api/templates/' + chosenTemplate.state.id, {
            method: 'get',
            headers: { 'Content-Type': 'application/json' },
          })
            .then((res) => {
              if (res?.status === 200) return res.json()
            })
            .then((result) => {
              const data = result?.data
                ? templateDetailTransform(result.data)
                : null
              if (data) {
                chosenTemplate.setState(data)
                setSlider(1)
              }
            })
        break
      case 1:
        setSlider(2)
        break
      case 2:
        const formData = {} as any
        formData.template_id = chosenTemplate.state.id
        formData.name = chosenTemplate.state.name
        formData.time = chosenTemplate.state.time
        const sections = [] as any[]
        if (chosenTemplate.state?.sections)
          chosenTemplate.state.sections.forEach((section: any) => {
            const returnSection = {} as any
            returnSection.section = section.sectionId
            const parts = [] as any[]
            if (section?.parts)
              section.parts.forEach((part: any) => {
                const returnPart = {} as any
                returnPart.name = part.name
                returnPart.question_types = part.questionTypes
                returnPart.total_question = part.totalQuestion
                returnPart.points = part.points
                returnPart.questions = part?.questions
                  ? part.questions.map((question: any) => question.id)
                  : []
                parts.push(returnPart)
              })
            returnSection.parts = parts
            sections.push(returnSection)
          })
        formData.sections = sections
        await fetch('/api/unit-test', {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }).then((res) => {
          if (res?.status === 200) {
            globalModal.setState({ id: 'share-link' })
          }
        })
        break
      default:
        break
    }
  }

  return (
    <div className={`m-footer-template ${className}`} style={style}>
      {slider > 0 && (
        <Button
          className="submit-btn"
          onClick={() => slider > 0 && setSlider(slider - 1)}
        >
          Previous
        </Button>
      )}
      {slider < 3 && (
        <Button
          className="submit-btn"
          appearance="primary"
          color="blue"
          disabled={!chosenTemplate?.state}
          onClick={() => handleSubmit()}
        >
          {slider === 2 ? 'Submit' : 'Next'}
        </Button>
      )}
    </div>
  )
}
