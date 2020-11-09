import React from 'react';
import { Link } from 'react-router-dom';

const SupportHomePage = () => (
  <main className="container-fluid m-5">
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
