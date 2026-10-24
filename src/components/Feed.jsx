import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addFeed } from '../utils/feedSlice'
import axios from 'axios'
import { API_BASE_URL } from '../utils/constants'
import UserCard from './UserCard'


const Feed = () => {
    const feed = useSelector(state => state.feed)
  const dispatch = useDispatch();
  console.log(feed);

  const fetchFeedData = async () => {
    try {
      if(feed) return;
      const response = await axios.get(`${API_BASE_URL}/user/feed`, {withCredentials: true});
      const data = response.data;
      dispatch(addFeed(data));
    } catch (error) {
      console.error('Error fetching feed data:', error);
    }
  }
  React.useEffect(() => {
    fetchFeedData();
  }, []);
  if(!feed || !feed.data || feed.data.length === 0) return <><p>No New user found</p></>;
  return (
    <div className="flex justify-center my-10">
  {feed && (
    <UserCard user={feed.data[0]} />
  )}

    </div>
  )
}

export default Feed
