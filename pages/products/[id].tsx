import type { NextPage } from "next";
import Button from "@/components/button";
import Layout from "@/components/layout";
import { useRouter } from "next/router";
import useSWR from "swr";
import Link from "next/link";
import { Product, User } from "@prisma/client";
import useMutation from "@/libs/client/useMutation";
import { cls } from "@/libs/client/utils";
import { useEffect } from "react";

interface ProductWithUser extends Product {
  user: User;
}
interface ItemDetailResponse {
  ok: boolean;
  product: ProductWithUser;
  relatedProducts: Product[];
  isLiked: boolean;
}

const ItemDetail: NextPage = () => {
  const router = useRouter();
  const { data: productData, mutate: boundMutate } = useSWR<ItemDetailResponse>(
    router.query.id ? `/api/products/${router.query.id}` : null
  );
  const [toggleFav] = useMutation(`/api/products/${router.query.id}/fav`);
  const onFavClick = () => {
    if (!productData) return;
    boundMutate((prev) => prev && { ...prev, isLiked: !prev.isLiked }, false);
    toggleFav({});
  };
  const [chatRoom, { data: chatRoomData, loading }] = useMutation(
    `/api/chats?productId=${productData?.product.id}&guestId=${productData?.product.user.id}`
  );
  const talkToSellerClick = () => {
    if (loading) return;
    chatRoom({});
  };
  useEffect(() => {
    if (chatRoomData && chatRoomData.ok) {
      router.push(`/chats/${chatRoomData.chatRoomId}`);
    }
  }, [chatRoomData, router]);
  return (
    <Layout canGoBack>
      <div className="px-4 py-4">
        <div className="mb-8">
          {productData?.product && (
            <img
              src={`https://imagedelivery.net/4aEUbX05h6IovGOQjgkfSw/${productData.product.image}/public`}
              className="object-cover w-full h-full bg-slate-300"
            />
          )}
          <div className="flex items-center py-3 space-x-3 border-t border-b cursor-pointer">
            {productData?.product.user.avatar && (
              <img
                src={`https://imagedelivery.net/4aEUbX05h6IovGOQjgkfSw/${productData?.product?.user?.avatar}/avatar`}
                className="w-12 h-12 rounded-full bg-slate-300"
              />
            )}
            <div>
              <p className="text-sm font-medium text-gray-700">
                {productData?.product?.user?.name}
              </p>
              <Link
                href={`/users/profiles/${productData?.product?.user?.id}`}
                className="text-xs font-medium text-gray-500"
              >
                View profile &rarr;
              </Link>
            </div>
          </div>
          <div className="mt-5">
            <h1 className="text-3xl font-bold text-gray-900">
              {productData?.product?.name}
            </h1>
            <span className="block mt-3 text-2xl text-gray-900">
              ${productData?.product?.price}
            </span>
            <p className="my-6 text-gray-700 ">
              {productData?.product?.description}
            </p>
            <div className="flex items-center justify-between space-x-2">
              <button
                onClick={talkToSellerClick}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-orange-500 border border-transparent rounded-md shadow-sm hover:bg-orange-600 focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:outline-none"
              >
                Talk to seller
              </button>
              <button
                onClick={onFavClick}
                className={cls(
                  "p-3 rounded-md flex items-center hover:bg-gray-100 justify-center ",
                  productData?.isLiked
                    ? "text-red-500  hover:text-red-600"
                    : "text-gray-400  hover:text-gray-500"
                )}
              >
                {productData?.isLiked ? (
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6 "
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Similar items</h2>
          <div className="grid grid-cols-2 gap-4 mt-6 ">
            {productData?.relatedProducts?.map((product) => (
              <div key={product.id}>
                <img
                  src={`https://imagedelivery.net/4aEUbX05h6IovGOQjgkfSw/${product.image}/public`}
                  className="w-full h-56 mb-4 bg-slate-300"
                />
                <h3 className="-mb-1 text-gray-700">{product.name}</h3>
                <span className="text-sm font-medium text-gray-900">
                  ${product.price}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default ItemDetail;
