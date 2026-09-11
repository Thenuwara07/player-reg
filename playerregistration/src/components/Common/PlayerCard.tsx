
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User } from '@/types';

interface PlayerCardProps {
  player: User;
  showStatus?: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, showStatus = false }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="card-hover">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
            {player.firstName.charAt(0)}{player.lastName.charAt(0)}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{player.fullName}</h3>
            <p className="text-gray-600">{player.district}, {player.province}</p>
            <div className="mt-2 space-y-1">
              <p className="text-sm text-gray-500">ID: {player.idCardNumber}</p>
              <p className="text-sm text-gray-500">Contact: {player.contactNumber}</p>
              {player.openClub && (
                <p className="text-sm text-gray-500">Open Club: {player.openClub}</p>
              )}
              {player.closeClub && (
                <p className="text-sm text-gray-500">Close Club: {player.closeClub}</p>
              )}
            </div>
            <div className="mt-3 flex items-center space-x-2">
              {showStatus && (
                <Badge className={getStatusColor(player.status)}>
                  {player.status.charAt(0).toUpperCase() + player.status.slice(1)}
                </Badge>
              )}
              {player.status === 'confirmed' && (
                <Badge className="bg-blue-100 text-blue-800">✓ Confirmed</Badge>
              )}
              <Badge className="bg-green-100 text-green-800">🟢 Registered</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerCard;
