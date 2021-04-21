import React from 'react';
import { Link } from 'react-router-dom';

const SupportHomePage = () => (
  <main className="container-fluid mt-3 mb-5">
    <h3>Support Tools</h3>
    <ul>
      <li>
        <Link id="search-users" to="/users">
          Search Users
        </Link>
      </li>
    </ul>
  </main>
);

export default SupportHomePage;
