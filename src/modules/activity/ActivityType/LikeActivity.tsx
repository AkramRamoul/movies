const LikeActivity = ({ activity }: { activity: any }) => {
  return <div className="text-sm">Liked movie {activity.movieId}</div>;
};

export default LikeActivity;
