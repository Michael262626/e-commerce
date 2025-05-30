import prisma from '@/lib/prisma'
import cloudinary from '@/lib/cloudinary'
import { getStoredProducts } from '@/utils/localStorage'
import { Product } from '@/types/product'

export async function getAllProducts() {
  return await prisma.product.findMany()
}

export async function getProductById(id: string) {
  return await prisma.product.findUnique({ where: { id } })
}

export async function deleteProductMedia(publicId: string) {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'auto' })
  } catch (error) {
    console.error('Error deleting media from Cloudinary:', error)
    throw new Error('Failed to delete media from Cloudinary')
  }
}

export const getFeaturedProducts = (): Product[] => {
  const products = getStoredProducts()
  return products.filter((product) => product.featured)
}

export const getRelatedProducts = (currentId: string, limit = 4): Product[] => {
  const products = getStoredProducts()
  const currentProduct = products.find((product) => product.id === currentId)
  if (!currentProduct) return []

  const sameCategory = products.filter(
    (product) => product.id !== currentId && product.category === currentProduct.category
  )

  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit)
  }

  const otherProducts = products.filter(
    (product) => product.id !== currentId && product.category !== currentProduct.category
  )

  return [...sameCategory, ...otherProducts].slice(0, limit)
}

export async function removeProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  if (product.cloudinaryPublicId) {
    await cloudinary.uploader.destroy(product.cloudinaryPublicId, {
      resource_type: product.image?.includes("video") ? "video" : "image",
    });
  }

  await prisma.product.delete({
    where: { id },
  });
}
