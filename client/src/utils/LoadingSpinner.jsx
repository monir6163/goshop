const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-[calc(100vh-88px)]">
      <p className="texxt-5xl lg:text-7xl font-bold">L</p>
      <div className="w-7 h-7 border-4 lg:w-12 lg:h-12 lg:border-8 border-dashed rounded-full animate-spin lg:mt-5 border-red-500"></div>
      <p className="texxt-5xl lg:text-7xl font-bold">ading....</p>
    </div>
  );
};

export default LoadingSpinner;
