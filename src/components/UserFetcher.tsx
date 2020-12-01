import React, { useEffect, useState } from "react";

export function UserFetcher() {
  const [users, setUsers] = useState<[]>([]);

  useEffect(() => {
    fetch("/users")
      .then((res) => res.json())
      .then((users) => setUsers( users ));
  }, []);

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user: any) => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>
    </div>
  );
}
