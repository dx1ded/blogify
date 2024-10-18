-- getRecursiveComments.sql

-- @param {String} $1:postId
WITH RECURSIVE comment_tree AS (
    SELECT
        id,
        "authorId",
        "postId",
        "parentCommentId",
        text,
        "createdAt"
    FROM
        "Comment"
    WHERE
        "postId" = $1 AND "parentCommentId" IS NULL -- Fetch top-level comments
    UNION ALL
    SELECT
        c.id,
        c."authorId",
        c."postId",
        c."parentCommentId",
        c.text,
        c."createdAt"
    FROM
        "Comment" c
            INNER JOIN
        comment_tree ct ON ct.id = c."parentCommentId" -- Fetch subcomments
)
SELECT
    ct.*,
    u.name AS "authorName",
    u.image AS "authorImage",
    ARRAY_AGG(DISTINCT lu.id) FILTER (WHERE lu.id IS NOT NULL) AS "likedByUserIds"
FROM
    comment_tree ct
        LEFT JOIN
    "User" u ON ct."authorId" = u.id
        LEFT JOIN
    "_CommentLikes" cl ON ct.id = cl."A"
        LEFT JOIN
    "User" lu ON cl."B" = lu.id
GROUP BY
    ct.id, ct."authorId", ct."postId", ct."parentCommentId", ct.text, ct."createdAt",
    u.name, u.image
ORDER BY
    ct."createdAt";
