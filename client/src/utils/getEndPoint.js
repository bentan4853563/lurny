const getEndPoint = () => {
  const { pathname } = window.location;
  const pathSegments = pathname.split("/").filter((segment) => segment);
  return pathSegments[pathSegments.length - 1];
};

export default getEndPoint;
