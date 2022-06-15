import { useEffect, useState } from 'react'

import { GetServerSideProps } from 'next'
import { useRouter } from 'next/dist/client/router'
import Error from 'next/error'

import { templateListTransformData } from 'api/dataTransform'
import { callApi } from 'api/utils'
import { CreateNewUnittest } from 'components/pages/createNewUnittest'

import { SingleTemplateContext } from '../../../interfaces/contexts'
import { BreadcrumbItemType } from '../../../interfaces/types'

export default function TemplateDetailPage({ id }: any) {
  const router = useRouter()

  const mode =
    router.query.templateSlug === 'create-new-template'
      ? 'create'
      : router.query?.mode === 'edit'
      ? 'update'
      : 'detail'

  const [chosenTemplate, setChosenTemplate] = useState(null)
  const [templateData, setTemplateData] = useState([])
  const [isReady, setIsReady] = useState(
    !['update', 'detail'].includes(mode) ? true : null,
  )
  const [isLoading, setIsLoading] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)

  const breadcrumbData: BreadcrumbItemType[] = [
    { name: 'Tổng quan', url: '/' },
    { name: 'Ngân hàng đề thi', url: '/unit-test' },
    {
      name:
        router.query.templateSlug === 'create-new-unittest'
          ? 'Tạo đề thi'
          : chosenTemplate?.name || '',
      url: null,
    },
  ]

  useEffect(() => {
    const fetchData = async () => {
      if (id === 'create-new-unittest') {
        setIsLoading(true)
        const response: any = await callApi(
          '/api/templates/search',
          'post',
          'Token',
          {
            page: 0,
            scope: 3,
          },
        )
        if (response?.templates) setTemplateData([...response.templates])
        if (response?.currentPage || response.currentPage === 0)
          setCurrentPage(response.currentPage + 1)
        if (response?.totalPages) setTotalPage(response.totalPages)
        if (response) {
          setIsReady(true)
          setIsLoading(false)
        }
      } else {
        const response: any = await callApi(`/api/unit-test/${id}`, 'GET')
        if (response?.status !== 200) {
          setIsReady(response?.status || 500)
          return
        }
        if (response) {
          const apiData = response?.data
          const originData = {
            id: apiData?.id || null,
            templateId: apiData?.template_id || null,
            author: apiData?.created_by || null,
            date: [apiData?.start_date || null, apiData?.end_date || null],
            name: apiData?.name || '',
            totalPoints: apiData?.total_point || 0,
            sections: apiData?.sections
              ? apiData.sections.map((section: any) => ({
                  id: section?.id || null,
                  parts: section?.parts
                    ? section.parts.map((part: any) => ({
                        id: part?.id || null,
                        name: part?.name || '',
                        points: part?.points || 0,
                        questions: part?.questions || [],
                        questionTypes: part?.question_types || '',
                        sectionId: part?.unit_test_section_id || null,
                        totalQuestion: part?.total_question || 0,
                      }))
                    : [],
                  sectionId: section?.section ? section.section.split(',') : [],
                }))
              : [],
            status: apiData?.status || false,
            templateLevelId: apiData?.template_level_id || '',
            time: apiData?.time || 0,
            totalQuestion: apiData?.total_question || 0,
          }
          setChosenTemplate({ ...originData })
          setIsReady(true)
        }
      }
    }

    fetchData()
  }, [])

  if (isReady !== true && !isLoading)
    return <Error statusCode={isReady || 500} />

  return (
    <SingleTemplateContext.Provider
      value={{
        breadcrumbData,
        mode:
          router.query.templateSlug === 'create-new-unittest'
            ? 'create'
            : router.query?.mode === 'edit'
            ? 'update'
            : 'detail',
        templateDetailOrigin: null,
        templateData: templateData.map(templateListTransformData),
        totalPages: totalPage,
        currentPage,
        chosenTemplate: { state: chosenTemplate, setState: setChosenTemplate },
      }}
    >
      <CreateNewUnittest
        title={
          router.query.templateSlug === 'create-new-unittest'
            ? 'Tạo đề thi'
            : chosenTemplate?.name || ''
        }
      />
    </SingleTemplateContext.Provider>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context

  return { props: { id: params.templateSlug } }
}
