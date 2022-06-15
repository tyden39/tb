import { GetServerSideProps } from 'next'
const PracticeTest = () => {
  return <></>
}

export const getServerSideProps: GetServerSideProps = async () => {
  return { notFound: true }
}

export default PracticeTest
