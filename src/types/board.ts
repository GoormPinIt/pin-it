export interface Board {
  id: string;
  description: string;
  isPrivate: boolean;
  ownerIds: string[];
  pins: {
    pinId: string[];
  };
  title: string;
  icon: string;
}
