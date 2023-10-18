import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@edx/paragon';
import PROVISIONING_PAGE_TEXT from '../data/constants';

const EditButton = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const editRoute = `/enterprise-configuration/learner-credit/${id}/edit`;
  const { FORM: { EDIT_BUTTON } } = PROVISIONING_PAGE_TEXT;

  const handleOnClick = () => {
    navigate(editRoute);
  };

  return (
    <Button
      onClick={handleOnClick}
      value={EDIT_BUTTON.description}
      variant="primary"
    >
      {EDIT_BUTTON.description}
    </Button>
  );
};

export default EditButton;
