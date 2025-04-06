import React from 'react';

const DeletePreview = ({ product }) => {
  return (
    <div className='p-4 bg-gray-50 rounded-lg border border-gray-200'>
      <div className='flex justify-center'>
        <img
          src={product.image}
          alt='Product to delete'
          className='h-48 w-full object-cover rounded-lg shadow-sm'
          style={{ aspectRatio: '7/5' }}
        />
      </div>
      <div className='mt-4 text-center'>
        <h3 className='font-medium'>{product.name}</h3>
        <p className='text-sm text-gray-500'>{product.color}</p>
      </div>
    </div>
  );
};

export default DeletePreview;
