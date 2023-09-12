import { useHistory, useParams } from 'react-router';
import { Button } from '@edx/paragon';
import PROVISIONING_PAGE_TEXT from '../data/constants';

const EditButton = () => {
  const history = useHistory();
  const { id } = useParams();

  const editRoute = `/enterprise-configuration/learner-credit/${id}/edit`;
  const { FORM: { EDIT_BUTTON } } = PROVISIONING_PAGE_TEXT;

  const handleOnClick = () => {
    history.push(editRoute);
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
