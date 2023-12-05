import {
  indexOnlyPropType,
} from '../../data/utils';

const PolicyDetailHeader = ({ index }) => (
  <article className="mt-4.5">
    <div className="mb-1">
      <h2>Budget #{index + 1}</h2>
      <hr />
    </div>
  </article>
);

PolicyDetailHeader.propTypes = indexOnlyPropType;

export default PolicyDetailHeader;
