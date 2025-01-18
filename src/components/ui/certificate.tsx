"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface CertificateProps {
  onCertificateClosed: () => void;
  certificateNumber?: string;
  dateReceived?: string;
}

const Certificate: React.FC<CertificateProps> = ({
  onCertificateClosed,
  certificateNumber,
  dateReceived,
}) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="bg-blue-500 text-white relative">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">
            Congratulations!
          </DialogTitle>
        </DialogHeader>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 text-white hover:text-blue-200"
          onClick={onCertificateClosed}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
        <p className="text-center text-sm opacity-90">
          You've earned a tree certificate for your contribution!
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="relative bg-[#e6f7f4] p-6 rounded-lg border-4 border-[#c5e6e2]">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#98c5c0] rounded-tl-lg -mt-1 -ml-1" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#98c5c0] rounded-tr-lg -mt-1 -mr-1" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#98c5c0] rounded-bl-lg -mb-1 -ml-1" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#98c5c0] rounded-br-lg -mb-1 -mr-1" />

          <div className="flex flex-col items-center gap-4">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 bg-sky-300 rounded-full" />
              <div className="absolute inset-2 bg-yellow-400 rounded-full" />
              <div className="absolute inset-4 bg-sky-300 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-green-500 clip-path-tree" />
              </div>
            </div>

            <div className="relative">
              <div className="bg-blue-500 text-white px-8 py-1 rounded-full">
                <span className="text-lg font-semibold">TABIGI</span>
              </div>
            </div>

            <p className="text-center text-sm text-gray-600 mt-2">
              THIS CERTIFICATE IS AWARDED TO
            </p>

            <p className="text-center text-sm mt-4">
              Congratulations on reporting this issue! Thank you for your part
              in helping rebuild Philippine pedestrians.
            </p>

            <div className="flex flex-row w-full justify-center text-sm text-gray-600 mt-4">
              <div className="text-center">
                <p className="font-medium">DATE RECEIVED</p>
                <p>{dateReceived || "-"}</p>
              </div>
            </div>

            <div className="mt-4 p-2 border border-gray-200 rounded-lg">
              <p className="text-xs text-gray-500 text-center">
                CERTIFICATE NUMBER
              </p>
              <p className="text-blue-500 font-mono text-center">
                {certificateNumber}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Certificate;

