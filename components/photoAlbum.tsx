import Image from "next/image";

type Photo = {
  src: string;
  alt: string;
};

const photos: Photo[] = [
  { src: "/placeholder.svg?height=300&width=300", alt: "Photo 1" },
  { src: "/placeholder.svg?height=300&width=300", alt: "Photo 2" },
  { src: "/placeholder.svg?height=300&width=300", alt: "Photo 3" },
  { src: "/placeholder.svg?height=300&width=300", alt: "Photo 4" },
  { src: "/placeholder.svg?height=300&width=300", alt: "Photo 5" },
  { src: "/placeholder.svg?height=300&width=300", alt: "Photo 6" },
];

export default function PhotoAlbum() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {photos.map((photo, index) => (
        <div key={index} className="aspect-square overflow-hidden rounded-lg">
          <Image
            src={photo.src}
            alt={photo.alt}
            width={300}
            height={300}
            className="object-cover w-full h-full"
          />
        </div>
      ))}
    </div>
  );
}

