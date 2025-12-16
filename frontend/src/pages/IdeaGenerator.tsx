import { useNavigate } from 'react-router-dom';
import SimpleIdeaGenerator from '../components/SimpleIdeaGenerator';

export default function IdeaGenerator() {
  const navigate = useNavigate();

  const handleIdeasSaved = () => {
    // Sau khi lưu xong, có thể navigate về dashboard
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SimpleIdeaGenerator onIdeasSaved={handleIdeasSaved} />
    </div>
  );
}


