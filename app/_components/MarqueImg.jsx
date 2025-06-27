export const MarqueImg = ({ img, alt = "", invert = false }) => {
  return (
  <div className="w-6 h-4 xl:w-24 xl:h-16 flex items-center justify-center mx-4">
  <img
    src={img}
    alt={alt}
    className={`max-w-full max-h-full object-contain grayscale hover:grayscale-0 transition duration-300 ${invert ? "invert" : ""}`}
  />
</div>

  );
};
