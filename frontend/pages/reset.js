import Reset from '../components/Reset';

const ResetPage = ({ query }) => (
  <div>
    <p>Reset Your Password</p>
    <Reset resetToken={query.resetToken} />
  </div>
);

export default ResetPage;
