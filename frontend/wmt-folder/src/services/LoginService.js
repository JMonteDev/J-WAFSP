import axios from 'axios'
const baseURL = 'http://127.0.0.1:8000/'

const login = async credentials => {
    const { data } = await axios.post(baseURL.concat("login/"), credentials);
    return data;
}

const logout = (setFirstName) => {
  window.localStorage.removeItem('loggedUser');
  setFirstName('');
}

const getFirstName = () => {  
    const tokenJSON = window.localStorage.getItem('loggedUser')
    const newToken = JSON.parse(tokenJSON);
    const token = `Bearer ${newToken}`

    const config = {
        headers: {
            'Authorization': token,
        }
    }
    
    const request = axios.post(baseURL.concat("getUser/"), {}, config);
    return request.then(response => response.data);
}

const getEmail = () => {  
  const tokenJSON = window.localStorage.getItem('loggedUser')
  const newToken = JSON.parse(tokenJSON);
  const token = `Bearer ${newToken}`

  const config = {
      headers: {
          'Authorization': token,
      }
  }
  
  const request = axios.post(baseURL.concat("getEmail/"), {}, config);
  return request.then(response => response.data);
}

const handleFirstName = async (setFirstName, setLoggedUser) => {
  let firstName = "";
  let tokenExpired = false;
  try{
    const data = await getFirstName();
    console.log("firstName:", data);

    firstName = data.first_name;
    setFirstName(firstName);

  } catch (e){
    console.log("token expirado");
    logout(setFirstName);

    setLoggedUser(-1);
    tokenExpired = true;
  }
  console.log('token', tokenExpired);
  return tokenExpired;
}

const getPrimitives = async () => {
  const request = await axios
  .get(baseURL.concat("PrimitiveTechnique/"))
  .then(result => {
      return (
          result.data.map( item => {
            console.log("item", item);
            
              return (
                  {label: item['primitiveName'], id: item['id'], description: item['primitiveDescription'],}
              );
          })
      );
  });
  
  return request;
}

const uploadPrimitiveTechnique = async (primitiveName, primitiveDescription, primitiveRequestMessage, primitiveClassName, primitiveFile, token) => {  // ESTO DEBERIA IR EN OTRO ARCHIVO
  var formData = new FormData();

  var email = await getEmail();
  
  formData.append("primitiveName", primitiveName);
  formData.append("primitiveDescription", primitiveDescription);
  formData.append("primitiveMessage", primitiveRequestMessage);
  formData.append("primitiveClassName", primitiveClassName);
  formData.append("primitiveFile", primitiveFile);
  formData.append("autorEmail", email.email);

  const newToken = `Bearer ${token}`
  const config = {
    headers: {
        'Authorization': newToken,
    }
  }

  var request = null;
  try {
    request = await axios.post(baseURL.concat("PrimitiveTechnique/"), formData, config)
  } catch (error) {
    console.error('Error en la solicitud:', error);
    request = error;
  }
  return request;
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { login, handleFirstName, getPrimitives, uploadPrimitiveTechnique };