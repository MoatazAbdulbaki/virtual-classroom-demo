interface Props {
  firstName: string;
  lastName: string;
  img?: string;
}

export const ParticipantsItem: React.FC<Props> = ({
  firstName,
  lastName,
  img,
}) => {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-14  w-14 items-center justify-center overflow-hidden rounded-full bg-gray-600">
        {img ? (
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}/${img}`}
            alt="my avatar"
            width="75px"
            height="75px"
          />
        ) : (
          <div className="relative inline-flex h-14 w-14 items-center justify-center overflow-hidden rounded-full">
            <span className="font-medium text-white">
              {`${firstName[0].toUpperCase()} ${lastName[0].toUpperCase()}`}
            </span>
          </div>
        )}
      </span>
      <p>{`${firstName} ${lastName}`}</p>
    </div>
  );
};

export default ParticipantsItem;
