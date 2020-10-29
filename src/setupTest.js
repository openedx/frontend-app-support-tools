import 'babel-polyfill';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import checkPropTypes from 'check-prop-types';

Enzyme.configure({ adapter: new Adapter() });

// eslint-disable-next-line import/prefer-default-export
export function checkProps(component, expectedProps) {
  return checkPropTypes(
    // eslint-disable-next-line react/forbid-foreign-prop-types
    component.propTypes,
    expectedProps,
    'props',
    component.name,
  );
}
