import React from 'react';

export const StatusBadge = ({ status }) => {
  const getColors = () => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
      case 'DONE':
      case 'PASSED':
      case 'SUCCESS':
      case 'HEALTHY':
      case 'APPROVED':
        return 'bg-[#F2F7F2] text-[#2E7D32] border-[#D6E6D6]';
      case 'IN_PROGRESS':
      case 'RUNNING':
      case 'DEPLOYING':
        return 'bg-[#F4F4FA] text-[#4A47A3] border-[#DFDFF2]';
      case 'TODO':
      case 'BACKLOG':
      case 'PLANNED':
      case 'DRAFT':
        return 'bg-[#F7F6F2] text-[#66635F] border-[#ECEAE5]';
      case 'IN_REVIEW':
      case 'QA_READY':
      case 'PENDING':
        return 'bg-[#FAF7F0] text-[#9E6A00] border-[#EFE3C8]';
      case 'FAILED':
      case 'BLOCKED':
      case 'BLOCKER':
      case 'CRITICAL':
      case 'REJECTED':
        return 'bg-[#FCF2F2] text-[#A61C1C] border-[#F4D2D2]';
      default:
        return 'bg-[#F7F6F2] text-[#66635F] border-[#ECEAE5]';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] text-[10px] tracking-[0.08em] uppercase font-medium border ${getColors()}`}
    >
      <span className="w-1 h-1 rounded-full bg-current opacity-75"></span>
      {status?.replace(/_/g, ' ')}
    </span>
  );
};

export default StatusBadge;

