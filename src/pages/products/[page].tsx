import { getProducts } from "@/api/products/getProducts";
import { Product } from "@/api/products/types";
import { Pagination } from "@/components/Pagination";
import { usePaginationSsr } from "@/shared/hooks/usePaginationSsr";
import { ProductsListItem } from "@/components/ProductsListItem";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import queryString from "query-string";
import { DEFAULT_TAKE } from "@/shared/constants/defaultPaginationValues";
import { NAVIGATION_LIST } from "@/shared/constants/navigationList";
import { APP_ROUTES } from "@/shared/constants/appRoutes";

type Params = {
  page: string;
};

const ProductsPage = ({
  products,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { pagination } = usePaginationSsr();
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <ul className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {products.map(({ image, price, rating, title, id }) => (
          <li key={id}>
            <Link
              href={{ pathname: APP_ROUTES.productsDetail, query: { id: id } }}
            >
              <ProductsListItem data={{ image, price, rating, title }} />
            </Link>
          </li>
        ))}
      </ul>
      <Pagination pagination={pagination} />
    </>
  );
};

export const getStaticPaths: GetStaticPaths<Params> = () => {
  const pages = Array.from({ length: 10 }, (_, i) => i + 1);

  return {
    paths: pages.map((page) => ({
      params: {
        page: page.toString(),
      },
    })),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<
  { products: Product[] },
  Params
> = async ({ params }) => {
  if (!params?.page) {
    return {
      notFound: true,
    };
  }

  const page = params?.page;
  const offset = (+page - 1) * DEFAULT_TAKE;

  const products = await getProducts(
    queryString.stringify({ take: DEFAULT_TAKE, offset }),
  );

  if (!products) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      products: products,
    },
  };
};

export default ProductsPage;