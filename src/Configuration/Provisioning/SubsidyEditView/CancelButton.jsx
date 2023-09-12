import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router';
import {
  ActionRow,
  Button,
  ModalDialog,
  useToggle,
} from '@edx/paragon';
import PROVISIONING_PAGE_TEXT from '../data/constants';
import { selectProvisioningContext } from '../data/utils';

const CancelButton = () => {
  const { FORM: { CANCEL } } = PROVISIONING_PAGE_TEXT;
  const [isOpen, open, close] = useToggle(false);
  const [hasEdits] = selectProvisioningContext('hasEdits');
  const params = useParams();
  const history = useHistory();
  const subsidyUuid = params.id;
  const viewRoute = `/enterprise-configuration/learner-credit/${subsidyUuid}/view`;

  const handleOnClick = () => {
    if (!hasEdits) {
      history.push(viewRoute);
    }
    return open();
  };

  return (
    <div>
      <Button variant="outline-primary" onClick={handleOnClick}>
        { CANCEL.description }
      </Button>
      <ModalDialog
        closeLabel="Cancel"
        title="Cancel Dialog"
        isOpen={isOpen}
        onClose={close}
        hasCloseButton
        variant="default"
      >
        <ModalDialog.Header>
          <ModalDialog.Title>
            {CANCEL.MODAL.TITLE}
          </ModalDialog.Title>
        </ModalDialog.Header>

        <ModalDialog.Body>
          <p>
            {CANCEL.MODAL.BODY}
          </p>
        </ModalDialog.Body>

        <ModalDialog.Footer>
          <ActionRow>
            <Button onClick={() => history.push(viewRoute)} variant="tertiary">{CANCEL.MODAL.FOOTER.options.leave}</Button>
            <ModalDialog.CloseButton>
              {CANCEL.MODAL.FOOTER.options.stay}
            </ModalDialog.CloseButton>
          </ActionRow>
        </ModalDialog.Footer>
      </ModalDialog>
    </div>
  );
};

export default CancelButton;
