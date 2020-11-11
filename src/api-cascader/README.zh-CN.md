# AweApiCascader

`ApiCascader` 封装于 `AweCascader` 组件，使得可以在其组件内部管理数据源，开发者只需传入数据服务方法即可。

## 使用方式

```jsx
import React from 'react';
import { AweApiCascader } from '@galiojs/awesome-antd';

export default function Demo() {
  const [userName, setUserName] = useState(null);

  const txtHandler = useCallback(({ target: { value } }) => {
    setUserName(value);
  }, []);

  return (
    <>
      <input onChange={txtHandler} />
      <AweApiCascader serviceQueries={[userName]} dataService={service} />
    </>
  );
}

async function service(userName) {
  const users = await fetchUsers(userName);

  return users;
}
```
