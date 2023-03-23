import { Button } from "@/components/Button";
import { ProductDetails } from "@/components/ProductDetails";
import { ProductsApiResponse } from "@/shared/types/productsResponse";
import { GetStaticPathsResult, GetStaticPropsContext, InferGetStaticPropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

type Param = { id: string };

const ProductDetailsPage = ({ product }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading..</div>;
  }

  if (!product) {
    return <div>Something went wrong!</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/products">
          <Button>Back</Button>
        </Link>
      </div>
      <ProductDetails data={product} />
    </div>
  );
};

export const getStaticPaths = async (): Promise<GetStaticPathsResult<Param>> => {
  const response = await fetch("https://fakestoreapi.com/products");
  const products: ProductsApiResponse[] = await response.json();

  return {
    paths: products.map((product) => {
      return {
        params: {
          id: product.id.toString(),
        },
      };
    }),
    fallback: false,
  };
};

export const getStaticProps = async ({ params }: GetStaticPropsContext<Param>) => {
  if (!params?.id) {
    return {
      notFound: true,
    };
  }

  const response = await fetch(`https://fakestoreapi.com/products/${params.id}`);
  const product: ProductsApiResponse | null = await response.json();

  if (!product) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      product,
    },
  };
};

export default ProductDetailsPage;