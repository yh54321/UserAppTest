import { useState, useRef, useEffect } from 'react'

const ACCOUNT = "Coke";
const LIMIT = 3; // How many users to fetch per page

function App() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [getMode, setGetMode] = useState(false);
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);

  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [users]); // Scroll to bottom when loading users
  
  const handleSubmit = async (e) => {
      e.preventDefault();
      if (!getMode) {
        try {
          const res = await fetch(`http://localhost:3000/api/user/create/${ACCOUNT}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName, lastName, email, password })
          });

          if (!res.ok) {
            throw new Error('User creation failed');
          } else {
            alert('User creation successful!')
          }

        } catch (err) {
          console.error(err.message)
        }
      } else {
        setGetMode(false);
      }
  };

  const handleClickGet = async (e) => {
    e.preventDefault();
    setGetMode(true);
    try {
      const res = await fetch(`http://localhost:3000/api/user/get/${ACCOUNT}?page=${page}&limit=${LIMIT}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error?.message || 'Getting users failed');
      } else {
          setUsers(prevUsers => [...prevUsers, ...data]);
          setPage(prevPage => prevPage + 1)
      }

    } catch (err) {
      console.error(err.message)
    }
  };
  
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/user/delete/${ACCOUNT}/${id}`, {
        method: 'DELETE',
      });

      console.log(res);
      
      if (!res.ok) {
        throw new Error('Deleting user failed');
      } else {
          setUsers(prevUsers => prevUsers.filter(user => user._id !== id));
      }

    } catch (err) {
      console.error(err.message)
    }
  };

  const UserRow = ({ user, num }) => { // Intentional component within component, minimal overhead
    return (
      <div className="user-row">
        <span className="user-name"><strong>{num}</strong>. {user.firstName} {user.lastName}</span>
        <button className="button is-danger is-small" onClick={() => handleDelete(user._id)}>
          Delete
        </button>
      </div>
    );
  };

    const UserRows = (props) => { // Intentional component within component, minimal overhead
      const userRows = [];

      let i = 1;
      for (const user of props.users) {
        userRows.push(<UserRow key={user.email} user={user} num={i} />);
        i++;
      }

      return userRows;
  };


  if (!getMode) {
    return (
      <form id="container" className="box" onSubmit={handleSubmit}>
        <div className="field">
          <label className="label">First Name</label>
          <div className="control">
            <input className="input" type="text" placeholder="Bob" value={firstName} onChange={e => setFirstName(e.target.value)} />
          </div>
        </div>

        <div className="field">
          <label className="label">Last Name</label>
          <div className="control">
            <input className="input" type="text" placeholder="Bobby" value={lastName} onChange={e => setLastName(e.target.value)} />
          </div>
        </div>

        <div className="field">
          <label className="label">Email</label>
          <div className="control">
            <input className="input" type="email" placeholder="e.g. alex@example.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
        </div>

        <div className="field">
          <label className="label">Password</label>
          <div className="control">
            <input className="input" type="password" placeholder="********" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
        </div>

        <div id="buttonDiv">
          <button className="button is-success" type="submit">Create</button>
          <button className="button is-primary left-margin" onClick={handleClickGet}>Get Users</button>
        </div>
      </form>
    )
  } else {
    return (
      <div id="container" className="box">
        <div id="scrollDiv" ref={scrollRef}>
          <UserRows users={users} />
        </div>
        <div id="buttonDiv">
          <button className="button is-success" onClick={() => setGetMode(false)}>Create</button>
          <button className="button is-primary left-margin" onClick={handleClickGet}>More</button>
        </div>
      </div>
    )
  }
}

export default App
