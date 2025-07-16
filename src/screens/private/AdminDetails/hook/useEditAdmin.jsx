import { useContext } from 'react';
import { AuthContext } from '../../../../context/AuthContext'; 
const useEditAdmin = () => {
  return useContext(AuthContext);
};

export default useEditAdmin;