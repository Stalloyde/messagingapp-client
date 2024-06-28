export type HeadersType = {
  'Content-Type': string;
  Authorization?: string;
};

export type messageType = {
  content: string;
  from: userType | string;
  to: userType | string;
};

export type groupType = {
  _id: string;
  groupName: string;
  profilePic: { url: string } | null;
  messages: messageType[];
  participants: userType[];
};

export type userType = {
  _id?: string;
  username: string;
  status: string;
  contacts: userType[];
  profilePic: { url: string } | null;
  messages: messageType[];
  contactsRequests: userType[];
  groups: groupType[];
};

export type ContextType = {
  token?: string;
  setToken: React.Dispatch<React.SetStateAction<string | undefined>>;
  currentUser?: userType;
  setCurrentUser: React.Dispatch<React.SetStateAction<userType | undefined>>;
  contacts: userType[];
  setContacts: React.Dispatch<React.SetStateAction<userType[]>>;
  contactsRequests: userType[];
  setContactsRequests: React.Dispatch<React.SetStateAction<userType[]>>;
};
