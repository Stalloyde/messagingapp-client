export type HeadersType = {
  'Content-Type': string;
  Authorization?: string;
};

export type messageType = {
  from: userType;
  content: string;
  userIdFrom: userType | number;
  userIdTo: userType | number;
};

export type groupType = {
  id: number;
  groupName: string;
  profilePic: string | null;
  messages: messageType[];
  participants: userType[];
};

export type userType = {
  from?: { id: number; userIdFrom: number; userIdTo: number; username: string };
  id?: number;
  username: string;
  status: string;
  contacts: userType[];
  profilePic: string | null;
  messages: messageType[];
  contactsRequestsFrom: userType[];
  contactsRequestsTo: userType[];
  groups: groupType[];
};

export type ContextType = {
  token?: string;
  setToken: React.Dispatch<React.SetStateAction<string | undefined>>;
  currentUser?: userType;
  setCurrentUser: React.Dispatch<React.SetStateAction<userType | undefined>>;
  url: string;
};
