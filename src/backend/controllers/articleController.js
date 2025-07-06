import { v2 as cloudinary } from "cloudinary"
import articleModel from "../models/articleModel.js";
import slugify from "slugify";

const addArticle = async (req, res) => {
    const { title, excerpt, content } = req.body
    const { userId, role } = req.admin
    const image = req.files.thumbnail && req.files.thumbnail[0]
    const imageUrl = await cloudinary.uploader.upload(image.path, { resource_type: 'image' })
    const slug = slugify(title, { lower: true, strict: true })

    try {
        const articleData = {
            authorId: userId,
            title,
            slug,
            content,
            excerpt,
            thumbnail: imageUrl.secure_url,
            tags: [],
            status: 'draft',
            views: 0,
            likes: 0,
            dislikes: 0,
        }

        const article = new articleModel(articleData);
        await article.save();
        res.json({ success: true, message: "Article added successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}



// Function to get all articles
const allArticle = async (req, res) => {
    try {
        const article = await articleModel.find({}).populate('authorId')
        res.json({ success: true, article })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//funtion for single article info
const singleArticle = async (req, res) => {
    try {
        const { slug, userId } = req.body
        const article = await articleModel.findOne({ slug }).populate('authorId')
        const checklike = article.isLike.map(id => id.toString()).includes(userId.toString());
        const checkDislike = article.isDisLike.map(id => id.toString()).includes(userId.toString());
        res.json({ success: true, article, checklike, checkDislike })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//Update article status from Admin panel
const updateStatus = async (req, res) => {
    try {
        const { articleId, status } = req.body
        await articleModel.findByIdAndUpdate(articleId, { status })
        res.json({ success: true, message: 'Status Updated' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//Set About from Admin panel
const setAboutArticle = async (req, res) => {
    try {
        const { articleId } = req.body;
        // Bỏ isAbout ở bài viết cũ (nếu có)
        await articleModel.updateMany({ isAbout: true }, { isAbout: false });
        // Set isAbout cho bài viết mới
        await articleModel.findByIdAndUpdate(articleId, { isAbout: true });
        res.json({ success: true, message: "Set About success" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

//function for like article
const likeArticle = async (req, res) => {
    try {
        const { slug, userId } = req.body;
        const article = await articleModel.findOne({ slug });

        if (!article) {
            return res.json({ success: false, message: "Article not found" });
        }

        // Check if the user has already liked the article
        if (article.isLike.includes(userId)) {
            await articleModel.findOneAndUpdate({ slug }, { $pull: { isLike: userId }, $inc: { likes: -1 } }, { new: true });
            return res.json({ success: true, message: "Article unliked successfully", likes: article.likes });
        }

        // Add user to isLike array and increment likes count
        if (article.isDisLike.includes(userId)) {
            await articleModel.findOneAndUpdate({ slug }, { $pull: { isDisLike: userId }, $inc: { dislikes: -1 } }, { new: true });
        }

        await articleModel.findOneAndUpdate({ slug }, { $addToSet: { isLike: userId }, $inc: { likes: 1 } }, { new: true });

        res.json({ success: true, message: "Article liked successfully", likes: article.likes });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

//function for dislike article
const dislikeArticle = async (req, res) => {
    try {
        const { slug, userId } = req.body;
        const article = await articleModel.findOne({ slug });

        if (!article) {
            return res.json({ success: false, message: "Article not found" });
        }

        // Check if the user has already disliked the article
        if (article.isDisLike.includes(userId)) {
            await articleModel.findOneAndUpdate({ slug }, { $pull: { isDisLike: userId }, $inc: { dislikes: -1 } }, { new: true });
            return res.json({ success: true, message: "Article undisliked successfully", dislikes: article.dislikes });
        }

        // Add user to isDisLike array and increment dislikes count
        if (article.isLike.includes(userId)) {
            await articleModel.findOneAndUpdate({ slug }, { $pull: { isLike: userId }, $inc: { likes: -1 } }, { new: true });
        }

        await articleModel.findOneAndUpdate({ slug }, { $addToSet: { isDisLike: userId }, $inc: { dislikes: 1 } }, { new: true });

        res.json({ success: true, message: "Article disliked successfully", dislikes: article.dislikes });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

//funtion for removing article
const removeArticle = async (req, res) => {
    try {
        await articleModel.findOneAndDelete(req.body.id)
        res.json({ success: true, message: "Article Removed" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { addArticle, allArticle, singleArticle, updateStatus, setAboutArticle, likeArticle, dislikeArticle, removeArticle }