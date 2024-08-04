import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import UserProfile from './UserProfile';
import GPTList from './GPTList';
import Subscriptions from './Subscriptions';
import Transactions from './Transactions';
import GPTAnalytics from './GPTAnalytics';
import SearchFilter from './SearchFilter';
import LoadingSkeleton from './LoadingSkeleton';
import ErrorBoundary from './ErrorBoundary';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [gpts, setGpts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [userResponse, gptsResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/user/profile', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`http://localhost:5000/api/gpt?page=${currentPage}&search=${searchTerm}&filter=${filter}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        setUser(userResponse.data.user);
        setGpts(gptsResponse.data.gpts);
        setTotalPages(gptsResponse.data.totalPages);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data. Please try again.');
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, searchTerm, filter]);

  if (loading) return <LoadingSkeleton />;
  if (error) return <div className="error">{error}</div>;

  return (
    <ErrorBoundary>
      <div className="dashboard">
        <UserProfile user={user} />
        <SearchFilter 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm}
          filter={filter}
          setFilter={setFilter}
        />
        <GPTList 
          gpts={gpts} 
          currentPage={currentPage} 
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
        <Subscriptions userId={user.id} />
        <Transactions userId={user.id} />
        <GPTAnalytics gpts={gpts} />
        <Link to="/create-gpt" className="btn btn-primary">Create New GPT</Link>
      </div>
    </ErrorBoundary>
  );
}

export default Dashboard;