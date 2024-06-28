import { Context } from '../App';
import { useContext } from 'react';

export function GetContext() {
  const propsContext = useContext(Context);
  if (!propsContext) throw new Error('No props found!');
  return propsContext;
}
