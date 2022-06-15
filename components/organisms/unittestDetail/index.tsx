import { useContext, useState } from 'react'

import { UnittestInfoCard } from 'components/atoms/unittestInfoCard'
import { FooterUnittest } from 'components/molecules/footerUnittest'
import { ProgressUnittest } from 'components/molecules/progressUnittest'
import { TemplateTableData } from 'components/molecules/templateTableData'
import { Wrapper } from 'components/templates/wrapper'
import { SingleTemplateContext } from 'interfaces/contexts'

import { DefaultPropsType } from '../../../interfaces/types'
import { PreviewSectionList } from '../../molecules/previewSectionList/index'
import { UnitSectionCard } from '../../molecules/unitSectionCard/index'

export const UnittestDetail = ({ className = '', style }: DefaultPropsType) => {
  const { breadcrumbData, templateData, totalPages, currentPage } = useContext(
    SingleTemplateContext,
  )

  const [slider, setSlider] = useState(0)

  return (
    <Wrapper
      className={`p-create-new-template p-detail-format ${className}`}
      // breadcrumbData={breadcrumbData}
      style={style}
    >
      <div className="p-detail-format__progress">
        {/* <ProgressUnittest value={slider} /> */}
      </div>
      {slider === 0 && (
        <>
          <TemplateTableData
            className="templates-table"
            title="Choose a templates"
            data={templateData}
            total={totalPages}
            pageIndex={currentPage}
            mode="createUnittest"
          />
        </>
      )}
      {slider === 1 && (
        <>
          <div className="p-detail-format__container">
            <div className="container-info">
              <UnittestInfoCard />
            </div>
            <div className="container-section-list">
              <UnitSectionCard />
            </div>
          </div>
        </>
      )}
      {slider === 2 && (
        <div className="p-detail-format__preview">
          <PreviewSectionList />
        </div>
      )}
      <div className="p-detail-format__submit --flex">
        <FooterUnittest slider={slider} setSlider={setSlider} />
      </div>
    </Wrapper>
  )
}
