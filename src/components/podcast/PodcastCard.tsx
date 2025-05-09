
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageSquare } from 'lucide-react';

interface PodcastCardProps {
  id: number;
  title: string;
  area: string;
  description: string;
  date: string;
  comments?: number;
  likes?: number;
  thumbnail: string;
}

const PodcastCard: React.FC<PodcastCardProps> = ({
  id,
  title,
  area,
  description,
  date,
  comments = 0,
  likes = 0,
  thumbnail
}) => {
  return (
    <Link to={`/podcast/${id}`} className="block">
      <div className="bg-juricast-card rounded-lg overflow-hidden hover:ring-1 hover:ring-juricast-accent/50 transition-all">
        <div className="relative">
          <img 
            src={thumbnail} 
            alt={title} 
            className="w-full h-48 object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-1 line-clamp-1">{title}</h3>
          <p className="text-juricast-accent text-sm mb-2">{area}</p>
          <p className="text-juricast-muted text-sm line-clamp-2 mb-4">{description}</p>
          
          <div className="flex justify-between items-center">
            <span className="text-juricast-muted text-xs">{date}</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-juricast-muted">
                <MessageSquare size={16} />
                <span className="text-xs">{comments}</span>
              </div>
              <div className="flex items-center gap-1 text-juricast-muted">
                <Heart size={16} />
                <span className="text-xs">{likes}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PodcastCard;
