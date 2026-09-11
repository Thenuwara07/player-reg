import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Post } from "@/types/authTypes";

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <Card className="card-hover mb-6 py-3">
      <CardHeader>
        <div className="flex items-center space-x-3 justify-between">
          {/* <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold">
            A
          </div> */}
          <h3 className="text-2xl font-bold">{post.title}</h3>
          <p className="text-xs text-gray-500 pr-5">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
        <h3 className="text-lg font-medium text-gray-600 mt-[-50%]">{post.subtitle}</h3>
        <div className="flex items-center justify-between mt-2">
          <div>
            {/* <h4 className="font-semibold">{post.user?.firstName}</h4> */}
          </div>
        </div>
      </CardHeader>
      <CardContent className="mt-2">
        <p className="text-gray-700 leading-relaxed mt-[-3%]">
          {post.content}
        </p>
        {post.imageName && (
          <img
            src={post.imageName}
            alt={post.title}
            className="mt-2 rounded-lg w-full h-64 object-cover"
          />
        )}
      </CardContent>
    </Card>
  );
};

export default PostCard;
