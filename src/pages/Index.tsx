import { useParams } from 'react-router-dom';
import CourseContentBuilder from '../components/CourseContentBuilder';

const Index = () => {
  const { rowId } = useParams<{ rowId: string }>();
  return <CourseContentBuilder rowId={rowId} />;
};

export default Index;
